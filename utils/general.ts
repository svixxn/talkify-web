export function addTimeToDate(timeString: string) {
  const now = new Date();
  const timeUnit = timeString.slice(-1);
  const timeValue = parseInt(timeString.slice(0, -1));

  switch (timeUnit) {
    case "h":
      now.setHours(now.getHours() + timeValue);
      break;
    case "m":
      now.setMinutes(now.getMinutes() + timeValue);
      break;
    case "s":
      now.setSeconds(now.getSeconds() + timeValue);
      break;
    case "d":
      now.setDate(now.getDate() + timeValue);
      break;
    default:
      console.error("Unsupported time unit");
  }

  return now;
}
