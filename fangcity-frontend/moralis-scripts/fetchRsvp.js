Moralis.Cloud.define(
  "fetchRsvp",
  async request => {
    const user = request?.user;
    const walletAddress = user?.get("ethAddress").toString();
    const event = request?.params?.event.toString();

    try {
      const RsvpQuery = new Moralis.Query("Rsvp");
      const rsvps = await RsvpQuery.equalTo("walletAddress", walletAddress).equalTo("event", event).find();

      if (rsvps?.length === 1) {
        return rsvps[0];
      } else {
        return null;
      }
    } catch (_) {
      return false;
    }
  },
  {
    fields: ["event"],
    requireUser: true,
  }
);
