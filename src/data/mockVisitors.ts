export const mockVisitors = [
  {
    id: "user_2fDz4sEd8mKk3JtZw1sKZJ3FgIi",
    username: "midulover_verified",
    email: "verified@midulandia.com",
    emailVerified: true,
    phoneVerified: true,
    roles: ["midulover", "moderator"],
    banned: false,
    provider: "google",
    imageUrl: "https://avatar.vercel.sh/midulandia",
    loginAttempts: 1,
    metadata: {
      skills: ["React", "Next.js"],
      lastLogin: "2023-10-05T14:23:12Z"
    }
  },
  {
    id: "user_2fDz9sEd8mKk3JtZw1sKZJ3FgIi",
    username: "suspicious_user",
    email: "hacker@darkweb.com",
    emailVerified: false,
    phoneVerified: false,
    roles: ["hacker"],
    banned: true,
    provider: "github",
    imageUrl: "https://avatar.vercel.sh/hacker",
    loginAttempts: 5,
    metadata: {
      skills: ["Phishing", "SQLi"],
      lastLogin: "2023-10-05T14:23:12Z"
    }
  }
]
