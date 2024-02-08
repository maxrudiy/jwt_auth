class UserDto {
  userId;
  firstName;
  lastName;
  email;
  isActivated;
  groups;
  constructor(userData) {
    this.userId = userData._id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.email = userData.email;
    this.isActivated = userData.isActivated;
    this.groups = userData.groups;
  }
}

export default UserDto;
