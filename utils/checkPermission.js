const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser);
  if (requestUser.role === "admin") return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Error("Not authorized to access this route");
};

export default checkPermissions;
