const { exec } = require("../tool/database");

const RoleCorrespondingMaxCount = {
  visitor: 10,
  user: 20,
  admin: Number.MAX_VALUE,
};

class ScheduleModel {
  constructor() {}

  async belongSomeOne(schedule_id, user_id) {
    const sql = `select count(*) as count from schedules where id=${schedule_id} and user_id=${user_id}`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].count > 0;
    } else {
      return false;
    }
  }

  // full schedule other table info
  async getOtherScheduleInfo(schedules) {
    for (let schedule of schedules) {
      // user name
      const { user_id } = schedule;
      let sql = `select users.name from users where id=${user_id}`;
      let res = await exec(sql);
      if (Array.isArray(res) && res.length > 0) {
        schedule.user_name = res[0].name;
      }

      // courses count
      const { id } = schedule;
      sql = `select count(*) as courses_count from courses where schedule_id=${id}`;
      res = await exec(sql);
      if (Array.isArray(res) && res.length > 0) {
        schedule.courses_count = res[0].courses_count;
      }
    }
    return schedules;
  }

  // get all public schedules
  async getAllPublicSchedules() {
    const sql = `select * from schedules where type='public' order by timestamp desc`;
    const res = await exec(sql);
    const CourseModel = require("./CourseModel");
    if (Array.isArray(res)) {
      // get every schedule's all courses
      for (let schedule of res) {
        const schedule_id = schedule.id;
        const courses = await CourseModel.getAllCourses(schedule_id);
        schedule.courses = courses;
      }
      return (await this.getOtherScheduleInfo(res));
    } else {
      return [];
    }
  }

  async getScheduleInfo(id) {
    const sql = `select * from schedules where id=${id}`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0];
    } else {
      return {};
    }
  }

  // get all private schedules
  async getAllSchedules(user_id) {
    const sql = `select * from schedules where user_id=${user_id} and type='private' order by timestamp desc`;
    const res = await exec(sql);
    const CourseModel = require("./CourseModel");
    if (Array.isArray(res)) {
      // get every schedule's all courses
      for (let schedule of res) {
        const schedule_id = schedule.id;
        const courses = await CourseModel.getAllCourses(schedule_id);
        schedule.courses = courses;
      }
      return (await this.getOtherScheduleInfo(res));
    } else {
      return [];
    }
  }

  // delete a schedule
  async delete(schedule_id) {
    const sql = `delete from schedules where id=${schedule_id} `;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }

  // user's shedule count is whether up to maximum or not
  async uptoCreateCountMaximum(user_id, role) {
    let count = 0;
    // get created count of user' s schedule
    let sql = `select count(*) as count from schedules where user_id=${user_id}`;
    let res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      count = res[0].count;
    }
    // compare count with role's corresponding max count
    const role_corresponding_max_count = RoleCorrespondingMaxCount[role];
    return count > role_corresponding_max_count;
  }

  // get public schedule count
  async getPublicScheduleCount() {
    const sql = `select count(*) as count from schedules where type='public'`;
    const res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      return res[0].count;
    }
    return 10;
  }

  // create schedule
  async create(name, user_id, type) {
    const sql = `insert into schedules (name, user_id, type) values ( 
      '${name}', ${user_id}, '${type}'  
    )`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }
}

module.exports = new ScheduleModel();
