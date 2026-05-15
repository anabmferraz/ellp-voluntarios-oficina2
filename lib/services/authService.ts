export type UserRole = 'admin' | 'voluntario';

export const canAccessVolunteerData = (
  userRole: UserRole, 
  userId: string, 
  targetId: string
) => {
  if (userRole === 'admin') return true;
  
  return userId === targetId;
};