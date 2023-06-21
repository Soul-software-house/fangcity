Moralis.Cloud.define("fetchFangmas", async request => {
  const user = request?.user;
  const DaysOfFangmas = new Moralis.Query("DaysOfFangmas");
  const daysOfFangmas = await DaysOfFangmas.ascending("number").find();

  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return daysOfFangmas.map(day => {
    var openAt = new Date(day?.get("openAt"));
    var startOfOpen = new Date(openAt.getFullYear(), openAt.getMonth(), openAt.getDate());
    const opened = new Date() > openAt;
    const today = startOfToday.getTime() === startOfOpen.getTime();

    const parsedDay = {
      claimed: user?.get("fangmas") === day?.get("number"),
      imageUrl: opened && !today ? day?.get("imageUrl") : "",
      openSeaUrl: opened && !today ? day?.get("openSeaUrl") : "",
      number: day?.get("number"),
      opened,
      today,
    };

    return parsedDay;
  });
});
