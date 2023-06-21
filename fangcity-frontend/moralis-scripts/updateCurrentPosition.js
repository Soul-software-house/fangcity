Moralis.Cloud.define(
  "updateCurrentPosition",
  async request => {
    const user = request?.user;
    const position = request?.params?.position;

    const FangsterQuery = new Moralis.Query("Fangster");
    const fangsters = await FangsterQuery.equalTo("tokenId", Number(user?.get("currentFangster"))).find();

    if (fangsters?.length === 1) {
      const fangster = fangsters[0];
      fangster.set("currentPosition", position);
      await fangster.save();
    }
    return true;
  },
  {
    fields: ["position"],
    requireUser: true,
  }
);
