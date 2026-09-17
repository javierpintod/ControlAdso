import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Add switchUser to interface
interface_patch = """  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;"""
content = content.replace("  switchRole: (role: UserRole) => void;", interface_patch)

# Add switchUser function
func_patch = """  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const matchedUser = users.find(u => u.role === newRole) || INITIAL_USERS.find(u => u.role === newRole) || INITIAL_USERS[0];
    setCurrentUser(matchedUser);
    
    if (newRole === 'admin') {
      showToast('Modo de acceso cambiado a: Administrador (RW - Control Total)', 'info');
    } else if (newRole === 'consulta') {
      showToast('Modo de acceso cambiado a: Auditor / Consulta (Solo Lectura)', 'info');
    } else {
      showToast('Modo de acceso cambiado a: Técnico de Soporte', 'info');
    }
  };

  const switchUser = (userId: string) => {
    const userToSwitch = users.find(u => u.id === userId);
    if (userToSwitch) {
      setCurrentUser(userToSwitch);
      setCurrentRole(userToSwitch.role);
      showToast(`Sesión iniciada como: ${userToSwitch.name}`, 'success');
    }
  };"""
  
content = content.replace("""  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const matchedUser = users.find(u => u.role === newRole) || INITIAL_USERS.find(u => u.role === newRole) || INITIAL_USERS[0];
    setCurrentUser(matchedUser);
    
    if (newRole === 'admin') {
      showToast('Modo de acceso cambiado a: Administrador (RW - Control Total)', 'info');
    } else if (newRole === 'consulta') {
      showToast('Modo de acceso cambiado a: Auditor / Consulta (Solo Lectura)', 'info');
    } else {
      showToast('Modo de acceso cambiado a: Técnico de Soporte', 'info');
    }
  };""", func_patch)

# Add switchUser to return value
return_patch = """        switchRole,
        switchUser,"""
content = content.replace("        switchRole,", return_patch)

with open('src/context/AppContext.tsx', 'w') as f:
    f.write(content)
print("Success")
