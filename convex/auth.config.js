export default {
  providers: [
    {
      domain: process.env.CLERK_HOSTNAME,
      applicationID: "convex",
    },
  ],
};
