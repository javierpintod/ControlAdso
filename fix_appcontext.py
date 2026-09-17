import re

with open('src/context/AppContext.tsx', 'r') as f:
    content = f.read()

# Replace switchRole function
old_switchRole = """  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'admin') {
      setCurrentUser(users[0]);
      showToast('Modo de acceso cambiado a: Administrador (RW - Control Total)', 'info');
    } else if (newRole === 'consulta') {
      setCurrentUser(users[1]);
      showToast('Modo de acceso cambiado a: Auditor / Consulta (Solo Lectura)', 'info');
    } else {
      setCurrentUser(users[2]);
      showToast('Modo de acceso cambiado a: Técnico de Soporte', 'info');
    }
  };"""

new_switchRole = """  const switchRole = (newRole: UserRole) => {
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
  };"""

if old_switchRole in content:
    content = content.replace(old_switchRole, new_switchRole)
    with open('src/context/AppContext.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find old_switchRole")
