Moralis.Cloud.define(
  "createChatMessage",
  async request => {
    const ChatMessage = Moralis.Object.extend("ChatMessage");
    const tokenId = request.params?.tokenId;
    const message = request.params?.message;
    const location = request.params?.location;

    try {
      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: "eth",
        address: request?.user?.get("ethAddress"),
        token_address: "0x9d418c2cae665d877f909a725402ebd3a0742844",
      });

      const tokenIds = nfts?.result?.length
        ? nfts.result
            .map(t => ([null, undefined].includes(t?.token_id) ? null : Number(t.token_id)))
            .filter(t => t || t === 0)
        : [];

      if (tokenIds.includes(Number(tokenId))) {
        const user = new ChatMessage();

        await user.save({ tokenId, message, location });
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  },
  {
    fields: ["tokenId", "message", "location"],
    requireUser: true,
  }
);
