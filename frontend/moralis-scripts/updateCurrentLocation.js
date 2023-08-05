Moralis.Cloud.define(
  "updateCurrentLocation",
  async request => {
    const user = request?.user;
    const location = request?.params?.location;

    const FangsterQuery = new Moralis.Query("Fangster");
    const fangsters = await FangsterQuery.equalTo("tokenId", Number(user.get("currentFangster"))).find();

    if (fangsters?.length === 1) {
      const fangster = fangsters[0];
      fangster.set("currentLocation", location);
      await fangster.save();
    }
    return true;
  },
  {
    fields: ["tokenId", "location"],
    requireUser: true,
  }
);
