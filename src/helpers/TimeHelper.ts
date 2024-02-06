export class TimeHelper {
  static timeSince(date: Date) {
    var seconds = Math.floor(
      ((new Date()).getTime() - date.getTime()) / 1000
    );
    
    var interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + "년";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + "달";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + "일";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + "시간";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + "분";
    }
    return Math.floor(seconds) + "초";
  }
}
