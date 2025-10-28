# How the Kill Process Flow Works

## Step-by-Step Visual Guide

### Step 1: Main Menu
When you run `node index.js`, you see the top 20 processes and a menu:

```
🔍 Top 20 Resource Abusers

Sorted by: CPU

┌──────────┬────────────┬────────────┬──────────────────────────────────────────────────┐
│ PID      │ CPU %      │ MEM %      │ COMMAND                                          │
├──────────┼────────────┼────────────┼──────────────────────────────────────────────────┤
│ 10307    │ 76.9%      │ 2.1%       │ claude                                           │
│ 73946    │ 54.5%      │ 0.1%       │ /Applications/Visual Studio Code.app/Contents    │
│ 14925    │ 54.0%      │ 0.4%       │ npm view @anthropic-ai/claude-code@latest ver    │
│ 14942    │ 42.0%      │ 0.3%       │ node                                             │
│ ...      │ ...        │ ...        │ ...                                              │
└──────────┴────────────┴────────────┴──────────────────────────────────────────────────┘

? What would you like to do? (Use arrow keys)
❯ 🔄 Refresh
  ⚡ Sort by CPU
  💾 Sort by Memory
  ❌ Kill a process (SIGTERM)    <-- SELECT THIS
  💀 Force kill a process (SIGKILL)
  🚪 Exit
```

### Step 2: Select "Kill a process (SIGTERM)"
Use arrow keys to navigate to this option and press Enter.

### Step 3: Multi-Select Process List
You'll see a **checkbox list** where you can select multiple processes:

```
? Select processes to kill (SIGTERM): (Press <space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)

 ◯ 10307     CPU: 76.9%  MEM: 2.1%  claude
 ◯ 73946     CPU: 54.5%  MEM: 0.1%  /Applications/Visual Studio Code.app/Contents
 ◯ 14925     CPU: 54.0%  MEM: 0.4%  npm view @anthropic-ai/claude-code@latest ver
❯◯ 14942     CPU: 42.0%  MEM: 0.3%  node
 ◯ 432       CPU: 25.6%  MEM: 0.5%  /System/Library/PrivateFrameworks/SkyLight.fr
 ◯ 696       CPU: 13.6%  MEM: 0.6%  /System/Library/CoreServices/NotificationCent
 ◯ 404       CPU: 11.0%  MEM: 0.1%  /System/Library/CoreServices/launchservicesd
 ◯ 73943     CPU: 10.5%  MEM: 0.6%  /Applications/Visual Studio Code.app/Contents
 ◯ 9044      CPU: 7.8%   MEM: 0.9%  /Applications/Visual Studio Code.app/Contents
 ... (more processes)

Navigation:
- Use ↑↓ arrow keys to move
- Press SPACE to select/deselect a process
- Press 'a' to toggle all
- Press 'i' to invert selection
- Press ENTER when done selecting
```

### Step 4: After Selecting Processes
Let's say you selected 2 processes (marked with ◉):

```
? Select processes to kill (SIGTERM):

 ◯ 10307     CPU: 76.9%  MEM: 2.1%  claude
 ◉ 73946     CPU: 54.5%  MEM: 0.1%  /Applications/Visual Studio Code.app/Contents
 ◯ 14925     CPU: 54.0%  MEM: 0.4%  npm view @anthropic-ai/claude-code@latest ver
 ◉ 14942     CPU: 42.0%  MEM: 0.3%  node
 ◯ 432       CPU: 25.6%  MEM: 0.5%  /System/Library/PrivateFrameworks/SkyLight.fr
```

Press ENTER to proceed.

### Step 5: Confirmation Prompt
Before killing anything, you'll get a **confirmation**:

```
? Are you sure you want to kill 2 process(es) with SIGTERM? (y/N)
```

- Type `y` and press Enter to confirm
- Type `n` or just press Enter to cancel (default is NO for safety)

### Step 6: Execution & Feedback
If you confirm, the script will attempt to kill each selected process:

```
✓ Killed process 73946
✓ Killed process 14942

2 processes killed, 0 failed
```

Or if some fail (e.g., due to permissions):

```
✓ Killed process 14942
✗ Failed to kill process 73946 (may require sudo)

1 processes killed, 1 failed
```

### Step 7: Return to Main Menu
After a 2-second delay, you're back at the main menu with refreshed process list.

---

## Key Safety Features

1. **Multi-select with checkboxes** - You see exactly what you're selecting
2. **Clear process info** - PID, CPU%, MEM%, and command name are all visible
3. **Confirmation required** - You must explicitly confirm with 'y'
4. **Default is NO** - Just pressing Enter cancels the operation
5. **Real-time feedback** - You see which processes were killed successfully and which failed
6. **Permission warnings** - If a kill fails, it suggests using sudo

## SIGTERM vs SIGKILL

- **SIGTERM** (❌ Kill a process):
  - Graceful shutdown
  - Allows process to clean up (save files, close connections)
  - Recommended first choice

- **SIGKILL** (💀 Force kill):
  - Immediate termination
  - Process cannot clean up
  - Use only when SIGTERM fails

Both options follow the same flow above, just with different signals!
