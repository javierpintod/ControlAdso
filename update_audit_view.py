import re

with open('src/components/audit/AuditView.tsx', 'r') as f:
    content = f.read()

# Replace imports
content = content.replace("import { WeeklyMatrixGrid } from './WeeklyMatrixGrid';", "import { InventoryAuditCalendar } from './InventoryAuditCalendar';")

# Find the start and end of tab 1
start_marker = "      {/* ========================================================================= */}\n      {/* TAB 1: CRONOGRAMA DE TOMAS FÍSICAS (LUNES A SÁBADO • 6 AM, 12 M, 6 PM)     */}\n      {/* ========================================================================= */}\n      {activeTab === 'cronograma' && ("
end_marker = "      {/* ========================================================================= */}\n      {/* TAB 2: ASIGNACIÓN DE INSTRUCTORES POR AMBIENTE                              */}"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    replacement = """      {/* ========================================================================= */}
      {/* TAB 1: CRONOGRAMA DE TOMAS FÍSICAS (LUNES A SÁBADO • 6 AM, 12 M, 6 PM)     */}
      {/* ========================================================================= */}
      {activeTab === 'cronograma' && (
        <InventoryAuditCalendar
          environments={environments}
          schedules={physicalSchedules}
          selectedDate={selectedDayTab}
          onSelectDate={setSelectedDayTab}
          onSelectSchedule={setActiveScheduleModal}
          onSelectAlert={(schedId) => {
            const relatedAlert = adminEmailAlerts.find(a => a.scheduleId === schedId) || adminEmailAlerts[0];
            if (relatedAlert) setActiveAlertModal(relatedAlert);
            else showToast('No se encontró alerta registrada para este turno', 'info');
          }}
          onAssignInstructor={setActiveEnvAssignModal}
          onMarkMissed={markScheduleAsMissed}
          onOpenPrintModal={() => setShowPrintModal(true)}
          adminEmailAddress={adminEmailAddress}
        />
      )}

"""
    # include the end_marker in the replacement since we slice up to end_idx
    content = content[:start_idx] + replacement + content[end_idx:]

    with open('src/components/audit/AuditView.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Could not find markers")
