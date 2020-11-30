const { exec } = require("../tool/database");
const COURSE_DATAS = require("../Lab3-timetable-data.json");

const ScheduleModel = require("./ScheduleModel");

class CourseModel {
  constructor() {}

  // format list
  forMatList(list) {
    const res = [];
    list.forEach((item) => {
      const { subject, catalog_nbr, className, catalog_description } = item;
      item.course_info.forEach((item) => {
        const one = Object.assign(item, {
          subject,
          catalog_nbr,
          className,
          catalog_description,
        });
        res.push(one);
      });
    });
    return res;
  }

  // get all course by schedule_id
  async getAllCourses(schedule_id) {
    const sql = `select * from courses where schedule_id=${schedule_id}`;
    const res = await exec(sql);
    if (Array.isArray(res)) {
      // get course info from json data by subject and catalog
      const courses = [];
      const promises = res.map(item => {
        const { subject, catalog } = item;
        return this.select(subject, catalog);
      });
      const promises_all_res = await Promise.all(promises);
      promises_all_res.forEach(item => {
        courses.push(...item);
      });
      courses.forEach((item, index) => {
        item.id = res[index].id;
      });
      return courses;
    } else {
      return [];
    }
  }

  // put a course to schedule
  async put(schedule_id, subject, catalog) {
    const sql = `insert into courses (schedule_id, subject, catalog)values(
      ${schedule_id}, '${subject}', '${catalog}'
    )`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }

  async belongSomeOne(course_id, user_id) {
    // get schedule id 
    let sql = `select schedule_id from courses where id=${course_id}`;
    let res = await exec(sql);
    if (Array.isArray(res) && res.length > 0) {
      const schedule_id = res[0].schedule_id;
      return ScheduleModel.belongSomeOne(schedule_id, user_id);
    } else {
      return false;
    }
  }


  // clear up a schedule
  async clearup(schedule_id) {
    const sql = `delete from courses where schedule_id=${schedule_id}`;
    const res = await exec(sql);
    if (res && res.affectedRows >= 0) {
      return true;
    } else {
      return false;
    }
  }

  // delete course 
  async delete(course_id) {
    const sql = `delete from courses where id=${course_id}`;
    const res = await exec(sql);
    if (res && res.affectedRows === 1) {
      return true;
    } else {
      return false;
    }
  }

  // search cousr from json data by catalog or classname
  async search(catalog, classname) {
    let res = [];
    const list = COURSE_DATAS.filter(item => {
      return (
        ( catalog ? String(item.catalog_nbr).includes(catalog) : true ) &&
        ( classname ? item.className.includes(classname) : true )
      )
    });
    res = this.forMatList(list);
    return res;
  }

  // select course from json data by conditions
  async select(subject, catalog = "") {
    let res = [];
    const reg = new RegExp(`${catalog}.*`)
    const list = COURSE_DATAS.filter((item) => {
      return (
        item.subject === subject &&
        (catalog ? reg.test(item.catalog_nbr) : true)
      );
    });
    
    res = this.forMatList(list);
    return res;
  }

  
}

module.exports = new CourseModel();
