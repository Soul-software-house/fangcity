Moralis.Cloud.define("fetchPxlFangmas", async request => {
  const user = request?.user;
  const DaysOfPxlFangmas = new Moralis.Query("DaysOfPxlFangmas");
  const daysOfPxlFangmas = await DaysOfPxlFangmas.ascending("number").find();
  const day = daysOfPxlFangmas.length ? daysOfPxlFangmas[0] : null;

  var now = new Date();
  var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  var openAt = new Date(day?.get("openAt"));
  var startOfOpen = new Date(openAt.getFullYear(), openAt.getMonth(), openAt.getDate());
  const opened = new Date() > openAt;
  const today = startOfToday.getTime() === startOfOpen.getTime();

  const parsedDay = {
    claimed: user?.get("pxlFangmas") === day?.get("number"),
    imageUrl: opened && !today ? day?.get("imageUrl") : "",
    openSeaUrl: opened ? day?.get("openSeaUrl") : "",
    number: day?.get("number"),
    opened,
    today,
  };

  return parsedDay;
});
