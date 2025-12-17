// Since it's a small project - In memory user DB
const users = new Map<string, { password: string; userId: string }>();

/*
Obviously in a real project this wouldn't be handled like this.
In a real project it would most likely be a proper database, with hashing and salting of the passwords.
If I have time I might try it.
*/
users.set("Test", { password: "TestPassword123", userId: "test-user-001" });
users.set("Bob", { password: "BillyBob342", userId: "test-user-002" });
users.set("Leon", { password: "Kennedy420", userId: "test-user-003" });
users.set("Verdance", { password: "Dance123", userId: "test-user-004" });

export const findUserByUsername = (username: string) => {
  return users.get(username);
};
