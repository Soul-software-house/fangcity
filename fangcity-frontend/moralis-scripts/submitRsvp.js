Moralis.Cloud.define(
  "submitRsvp",
  async request => {
    const user = request?.user;
    const walletAddress = user?.get("ethAddress").toString();
    const event = request?.params?.event.toString();
    const attendees = Number(request?.params?.attendees);
    const name = request?.params?.name.toString();

    try {
      const Rsvp = Moralis.Object.extend("Rsvp");
      const RsvpQuery = new Moralis.Query("Rsvp");
      const rsvps = await RsvpQuery.equalTo("walletAddress", walletAddress).equalTo("event", event).find();

      if (rsvps?.length === 1) {
        const rsvp = rsvps[0];
        rsvp.set("attendees", attendees);
        rsvp.set("name", name);
        await rsvp.save();
      } else {
        const rsvp = new Rsvp();
        await rsvp.save({ walletAddress, event, attendees, name });
      }

      return true;
    } catch (_) {
      return false;
    }
  },
  {
    fields: ["event", "attendees", "name"],
    requireUser: true,
  }
);
