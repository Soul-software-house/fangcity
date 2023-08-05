Moralis.Cloud.define(
  "updateLastActivityAt",
  async request => {
    const user = request?.user;

    const FangsterQuery = new Moralis.Query("Fangster");
    const fangsters = await FangsterQuery.equalTo("tokenId", Number(user?.get("currentFangster"))).find();

    if (fangsters?.length === 1) {
      const fangster = fangsters[0];
      fangster.set("lastActivityAt", new Date());
      await fangster.save();
    }
    return true;
  },
  {
    fields: ["tokenId"],
    requireUser: true,
  }
);
