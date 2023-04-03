exports.getdate = function () {
  const options = { weekday: "long", day: "numeric", month: "long" };
  const today = new Date();
  return today.toLocaleDateString("en-IN", options);
};

exports.getDayName = function () {
  const date = new Date();
  const locale = { weekday: "long" };
  return date.toLocaleDateString("en-IN", locale);
};
