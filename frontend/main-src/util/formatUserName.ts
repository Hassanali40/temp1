export const formatUserName = (user: string) => {
  const sections = user.split(',');
  return sections.length > 1 ? sections[1] : user;
};
