Moralis.Cloud.define(
  "updateCurrentDirection",
  async request => {
    const user = request?.user;
    const direction = request?.params?.direction;

    const FangsterQuery = new Moralis.Query("Fangster");
    const fangsters = await FangsterQuery.equalTo("tokenId", Number(user?.get("currentFangster"))).find();

    if (fangsters?.length === 1) {
      const fangster = fangsters[0];
      fangster.set("currentDirection", direction);
      await fangster.save();
    }
    return true;
  },
  {
    fields: ["direction"],
    requireUser: true,
  }
);
