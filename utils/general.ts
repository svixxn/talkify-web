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

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts && parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
}

export const parseMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset();

  const now = new Date();
  now.setMinutes(now.getMinutes() - offset);

  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 30) {
    return `${days}d`;
  } else {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]}, ${year}`;
  }
};
