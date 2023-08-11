chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.notifications.create(
    {
      type: "basic",
      iconUrl: "/media/899054.png",
      title: "Alarm",
      message: `It is ${new Date(alarm.scheduledTime)}`,
      silent: false,
    },
    () => {}
  );
});
