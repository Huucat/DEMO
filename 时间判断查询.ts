import dayjs from "dayjs";

function getActivityTimes(startTimes, announcementTimes) {
  const now = dayjs();

  for (let i = 0; i < startTimes.length; i++) {
    const startTime = dayjs(startTimes[i]);
    const announcementTime = dayjs(announcementTimes[i]);

    // 当前时间早于本期的开始时间，显示本期的开始时间
    if (now.isBefore(startTime)) {
      return {
        showStartTime: startTime.format("YYYY-MM-DD HH:mm:ss"),
        showAnnouncementTime: null,
        showNextStartTime: null,
      };
    }

    // 当前时间在本期开始时间与公示时间之间，显示公示时间和下一期的开始时间
    if (now.isAfter(startTime) && now.isBefore(announcementTime)) {
      return {
        showStartTime: null,
        showAnnouncementTime: announcementTime.format("YYYY-MM-DD HH:mm:ss"),
        showNextStartTime:
          i + 1 < startTimes.length
            ? dayjs(startTimes[i + 1]).format("YYYY-MM-DD HH:mm:ss")
            : null,
      };
    }
  }

  // 如果已经到了最后一期的公示时间之后，显示最后一期的公示时间，不显示下一期的开始时间
  return {
    showStartTime: null,
    showAnnouncementTime: dayjs(
      announcementTimes[announcementTimes.length - 1]
    ).format("YYYY-MM-DD HH:mm:ss"),
    showNextStartTime: null,
  };
}

// 示例数据
const startTimes = [
  "2024-08-01T10:00:00",
  "2024-09-01T10:00:00",
  "2024-10-01T10:00:00",
];
const announcementTimes = [
  "2024-08-05T10:00:00",
  "2024-09-05T10:00:00",
  "2024-10-05T10:00:00",
];

// 调用函数获取显示时间
const result = getActivityTimes(startTimes, announcementTimes);

console.log(result);
// 输出结果根据当前时间动态变化
