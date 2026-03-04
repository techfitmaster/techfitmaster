// Albert 健身计划自动化脚本
// 适用于 Scriptable APP (iOS/macOS)

const calendar = await Calendar.forEventsByTitle("Albert 健身计划");
const startDate = new Date(2026, 1, 9); // 2026-02-09
const weeks = 26; // 6个月

// 训练计划定义
const workouts = [
  {
    day: 1, // 周一
    title: "💪 上肢+核心训练",
    duration: 60,
    time: "19:00",
    description: "俯卧撑 4×15-20\\nPike俯卧撑 4×12\\n引体向上 4×8-12\\n臂屈伸 4×12\\n平板支撑 4×60秒\\n卷腹 4×20\\n\\n结束：30分钟HIIT或跳绳"
  },
  {
    day: 2, // 周二
    title: "🦵 下肢+爆发力训练",
    duration: 60,
    time: "19:00",
    description: "深蹲 5×20\\n保加利亚分腿蹲 4×15(每腿)\\n深蹲跳 4×15\\n箭步蹲 4×15(每腿)\\n臀桥 4×20\\n提踵 4×30\\n\\n结束：15分钟高抬腿"
  },
  {
    day: 3, // 周三
    title: "🔥 HIIT全身燃脂",
    duration: 40,
    time: "19:00",
    description: "Tabata模式(20秒训练+10秒休息)\\n循环4-5组：\\n1. 波比跳\\n2. 深蹲跳\\n3. 登山跑\\n4. 开合跳\\n5. 高抬腿\\n6. 俯卧撑"
  },
  {
    day: 4, // 周四
    title: "💪 上肢+核心训练",
    duration: 60,
    time: "19:00",
    description: "俯卧撑 4×15-20\\nPike俯卧撑 4×12\\n引体向上 4×8-12\\n臂屈伸 4×12\\n平板支撑 4×60秒\\n卷腹 4×20\\n\\n结束：30分钟HIIT或跳绳"
  },
  {
    day: 5, // 周五
    title: "🦵 下肢+爆发力训练",
    duration: 60,
    time: "19:00",
    description: "深蹲 5×20\\n保加利亚分腿蹲 4×15(每腿)\\n深蹲跳 4×15\\n箭步蹲 4×15(每腿)\\n臀桥 4×20\\n提踵 4×30\\n\\n结束：15分钟高抬腿"
  },
  {
    day: 6, // 周六
    title: "🔥 HIIT全身燃脂",
    duration: 40,
    time: "19:00",
    description: "Tabata模式(20秒训练+10秒休息)\\n循环4-5组：\\n1. 波比跳\\n2. 深蹲跳\\n3. 登山跑\\n4. 开合跳\\n5. 高抬腿\\n6. 俯卧撑"
  },
  {
    day: 0, // 周日
    title: "🧘 拉伸+轻度有氧",
    duration: 60,
    time: "10:00",
    description: "瑜伽/拉伸 20分钟\\n快走/慢跑 30分钟\\n\\n恢复日，强度放低"
  }
];

// 创建重复事件
for (let workout of workouts) {
  for (let week = 0; week < weeks; week++) {
    let eventDate = new Date(startDate);
    eventDate.setDate(eventDate.getDate() + week * 7 + (workout.day - 1));
    
    let [hour, minute] = workout.time.split(":");
    eventDate.setHours(parseInt(hour), parseInt(minute), 0);
    
    let event = new CalendarEvent();
    event.calendar = calendar;
    event.title = workout.title;
    event.startDate = eventDate;
    event.endDate = new Date(eventDate.getTime() + workout.duration * 60000);
    event.notes = workout.description;
    event.location = "家";
    
    // 提前30分钟提醒
    event.addAlarm(Alert.time(-30));
    
    await event.save();
  }
}

// 每周一早上8点体重测量提醒
for (let week = 0; week < weeks; week++) {
  let weighDate = new Date(startDate);
  weighDate.setDate(weighDate.getDate() + week * 7);
  weighDate.setHours(8, 0, 0);
  
  let weighEvent = new CalendarEvent();
  weighEvent.calendar = calendar;
  weighEvent.title = "⚖️ 每周体重测量";
  weighEvent.startDate = weighDate;
  weighEvent.endDate = new Date(weighDate.getTime() + 5 * 60000);
  weighEvent.notes = "空腹测量体重、腰围、臀围\\n记录到备忘录\\n\\n目标：每周减重1-2斤";
  weighEvent.addAlarm(Alert.time(0));
  
  await weighEvent.save();
}

console.log("✅ 已创建 " + (weeks * 8) + " 个训练事件！");
Script.complete();
