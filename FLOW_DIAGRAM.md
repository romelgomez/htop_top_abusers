# Kill Process Flow Diagram

```
┌─────────────────────────────────────────────┐
│         START: Run node index.js            │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  STEP 1: Display Top 20 Processes           │
│  ┌───────────────────────────────────────┐  │
│  │ PID    CPU%   MEM%   COMMAND          │  │
│  │ 10307  76.9%  2.1%   claude           │  │
│  │ 73946  54.5%  0.1%   VS Code          │  │
│  │ 14942  42.0%  0.3%   node             │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  STEP 2: Main Menu (Arrow Key Navigation)  │
│  ┌───────────────────────────────────────┐  │
│  │  ❯ 🔄 Refresh                         │  │
│  │    ⚡ Sort by CPU                      │  │
│  │    💾 Sort by Memory                   │  │
│  │  → ❌ Kill a process (SIGTERM) ◄─────  │  │ <-- YOU SELECT THIS
│  │    💀 Force kill (SIGKILL)             │  │
│  │    🚪 Exit                             │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  STEP 3: Multi-Select with Checkboxes      │
│  ┌───────────────────────────────────────┐  │
│  │ Select processes to kill (SIGTERM):   │  │
│  │                                        │  │
│  │  ◯ 10307  CPU: 76.9%  claude          │  │ <-- Press SPACE to check/uncheck
│  │  ◉ 73946  CPU: 54.5%  VS Code         │  │ <-- SELECTED (◉)
│  │  ◯ 14925  CPU: 54.0%  npm             │  │ <-- Use ↑↓ to navigate
│  │  ◉ 14942  CPU: 42.0%  node            │  │ <-- SELECTED (◉)
│  │  ◯ 432    CPU: 25.6%  SkyLight        │  │
│  │  ...                                   │  │
│  │                                        │  │
│  │ Tips:                                  │  │
│  │ - SPACE: select/unselect              │  │
│  │ - a: toggle all                       │  │
│  │ - i: invert selection                 │  │
│  │ - ENTER: proceed                      │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  STEP 4: Confirmation (Safety Check!)      │
│  ┌───────────────────────────────────────┐  │
│  │ ⚠️  Are you sure you want to kill     │  │
│  │    2 process(es) with SIGTERM?        │  │
│  │                                        │  │
│  │    (y/N) ▌                            │  │
│  │                                        │  │
│  │    Selected PIDs:                     │  │
│  │    • 73946 (VS Code)                  │  │
│  │    • 14942 (node)                     │  │
│  │                                        │  │
│  │    Default: NO (press Enter to cancel)│  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
       [y]                 [n]
        │                   │
        ▼                   ▼
┌──────────────┐   ┌────────────────┐
│  PROCEED     │   │  CANCEL        │
│  with kill   │   │  (return to    │
│              │   │   main menu)   │
└──────┬───────┘   └────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  STEP 5: Execute & Show Results            │
│  ┌───────────────────────────────────────┐  │
│  │ Killing processes...                  │  │
│  │                                        │  │
│  │ ✓ Killed process 73946                │  │ <-- Success
│  │ ✓ Killed process 14942                │  │ <-- Success
│  │                                        │  │
│  │ 2 processes killed, 0 failed          │  │
│  │                                        │  │
│  │ (Waiting 2 seconds...)                │  │
│  └───────────────────────────────────────┘  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│  STEP 6: Return to Main Menu (Refreshed)   │
│                                             │
│  Process list automatically refreshes       │
│  Killed processes are gone from the list   │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
       [Loop back to STEP 1]
```

## Example Scenarios

### Scenario A: Successfully Kill 2 Processes
```
1. See process list
2. Choose "❌ Kill a process (SIGTERM)"
3. Select processes 73946 and 14942 with SPACE
4. Press ENTER
5. Type 'y' and ENTER to confirm
6. Result: ✓ Killed process 73946
           ✓ Killed process 14942
           2 processes killed, 0 failed
```

### Scenario B: Permission Denied
```
1. See process list
2. Choose "❌ Kill a process (SIGTERM)"
3. Select system process 432
4. Press ENTER
5. Type 'y' and ENTER to confirm
6. Result: ✗ Failed to kill process 432 (may require sudo)
           0 processes killed, 1 failed
```

### Scenario C: Cancel Operation
```
1. See process list
2. Choose "❌ Kill a process (SIGTERM)"
3. Select any processes
4. Press ENTER
5. Type 'n' or just press ENTER
6. Result: Cancelled - returns to main menu
```

## Safety Features Highlighted

🛡️ **Multiple Safety Layers:**
1. **Visual Selection**: See exactly what you're selecting with checkboxes
2. **Clear Information**: Each process shows PID, CPU%, MEM%, and full command
3. **Confirmation Required**: Must explicitly type 'y' to proceed
4. **Default is Safe**: Pressing Enter without typing 'y' cancels
5. **Feedback Loop**: See success/failure for each kill attempt
6. **Permission Awareness**: Warns if sudo is needed

This design prevents accidental kills and ensures you always know what's happening!
