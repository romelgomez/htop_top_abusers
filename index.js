#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * Get top processes sorted by CPU or Memory usage
 */
function getTopProcesses(sortBy = 'cpu', limit = 20) {
  try {
    // Use ps command which is more reliable than parsing htop
    // -e: all processes
    // -o: output format
    // Sort by CPU or MEM
    const sortFlag = sortBy === 'cpu' ? '-pcpu' : '-pmem';

    const command = `ps -e -o pid,pcpu,pmem,comm | sort -k2 -nr | head -n ${limit + 1}`;
    const output = execSync(command, { encoding: 'utf-8' });

    const lines = output.trim().split('\n');
    const processes = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(/\s+/);

      if (parts.length >= 4) {
        const pid = parts[0];
        const cpu = parseFloat(parts[1]);
        const mem = parseFloat(parts[2]);
        const command = parts.slice(3).join(' ');

        processes.push({
          pid,
          cpu: cpu.toFixed(1),
          mem: mem.toFixed(1),
          command,
          display: `${chalk.yellow(pid.padEnd(8))} ${chalk.red(cpu.toFixed(1) + '%').padEnd(12)} ${chalk.blue(mem.toFixed(1) + '%').padEnd(12)} ${chalk.green(command)}`
        });
      }
    }

    return processes;
  } catch (error) {
    console.error(chalk.red('Error fetching processes:'), error.message);
    return [];
  }
}

/**
 * Display processes in a nice table format
 */
function displayProcessTable(processes, sortBy) {
  console.clear();
  console.log(chalk.bold.cyan('\n🔍 Top 20 Resource Abusers\n'));
  console.log(chalk.gray(`Sorted by: ${sortBy.toUpperCase()}\n`));

  const table = new Table({
    head: [
      chalk.bold.white('PID'),
      chalk.bold.white('CPU %'),
      chalk.bold.white('MEM %'),
      chalk.bold.white('COMMAND')
    ],
    colWidths: [10, 12, 12, 50],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  processes.forEach(proc => {
    const cpuColor = parseFloat(proc.cpu) > 50 ? chalk.red : parseFloat(proc.cpu) > 20 ? chalk.yellow : chalk.white;
    const memColor = parseFloat(proc.mem) > 50 ? chalk.red : parseFloat(proc.mem) > 20 ? chalk.yellow : chalk.white;

    table.push([
      chalk.yellow(proc.pid),
      cpuColor(proc.cpu + '%'),
      memColor(proc.mem + '%'),
      chalk.green(proc.command.substring(0, 45))
    ]);
  });

  console.log(table.toString());
  console.log('\n');
}

/**
 * Kill a process by PID
 * Automatically retries with sudo if permission is denied
 */
function killProcess(pid, signal = 'SIGTERM') {
  try {
    // First attempt without sudo
    execSync(`kill -${signal} ${pid}`, { encoding: 'utf-8', stdio: 'pipe' });
    return { success: true, usedSudo: false };
  } catch (error) {
    // Check if it's a permission error
    const errorMsg = error.message.toLowerCase();
    const isPermissionError = errorMsg.includes('operation not permitted') ||
                             errorMsg.includes('permission denied') ||
                             error.status === 1;

    if (isPermissionError) {
      try {
        // Retry with sudo
        console.log(chalk.yellow(`  ⚠️  Permission denied for PID ${pid}, attempting with sudo...`));
        execSync(`sudo kill -${signal} ${pid}`, { encoding: 'utf-8', stdio: 'inherit' });
        return { success: true, usedSudo: true };
      } catch (sudoError) {
        return { success: false, usedSudo: true, error: sudoError.message };
      }
    }

    return { success: false, usedSudo: false, error: error.message };
  }
}

/**
 * Main interactive loop
 */
async function main() {
  let sortBy = 'cpu';
  let running = true;

  while (running) {
    const processes = getTopProcesses(sortBy, 20);

    if (processes.length === 0) {
      console.log(chalk.red('No processes found or error occurred.'));
      process.exit(1);
    }

    displayProcessTable(processes, sortBy);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: '🔄 Refresh', value: 'refresh' },
          { name: '⚡ Sort by CPU', value: 'sort_cpu' },
          { name: '💾 Sort by Memory', value: 'sort_mem' },
          { name: '❌ Kill a process (SIGTERM)', value: 'kill_term' },
          { name: '💀 Force kill a process (SIGKILL)', value: 'kill_force' },
          { name: '🚪 Exit', value: 'exit' }
        ]
      }
    ]);

    switch (action) {
      case 'refresh':
        // Loop continues, will refresh
        break;

      case 'sort_cpu':
        sortBy = 'cpu';
        break;

      case 'sort_mem':
        sortBy = 'mem';
        break;

      case 'kill_term':
      case 'kill_force':
        const signal = action === 'kill_force' ? 'SIGKILL' : 'SIGTERM';
        const { selectedProcesses } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedProcesses',
            message: `Select processes to kill (${signal}):`,
            choices: processes.map(proc => ({
              name: `${proc.pid.padEnd(8)} CPU: ${proc.cpu}%  MEM: ${proc.mem}%  ${proc.command}`,
              value: proc.pid
            })),
            pageSize: 15
          }
        ]);

        if (selectedProcesses.length > 0) {
          const { confirm } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'confirm',
              message: chalk.red(`Are you sure you want to kill ${selectedProcesses.length} process(es) with ${signal}?`),
              default: false
            }
          ]);

          if (confirm) {
            let success = 0;
            let failed = 0;
            let sudoUsed = 0;

            for (const pid of selectedProcesses) {
              const result = killProcess(pid, signal);
              if (result.success) {
                if (result.usedSudo) {
                  console.log(chalk.green(`✓ Killed process ${pid} (with sudo)`));
                  sudoUsed++;
                } else {
                  console.log(chalk.green(`✓ Killed process ${pid}`));
                }
                success++;
              } else {
                const errorDetail = result.error ? `: ${result.error}` : '';
                console.log(chalk.red(`✗ Failed to kill process ${pid}${errorDetail}`));
                failed++;
              }
            }

            console.log(chalk.cyan(`\n${success} processes killed${sudoUsed > 0 ? ` (${sudoUsed} with sudo)` : ''}, ${failed} failed`));
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
        break;

      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye!\n'));
        running = false;
        break;
    }
  }
}

// Run the application
main().catch(error => {
  console.error(chalk.red('Fatal error:'), error);
  process.exit(1);
});
