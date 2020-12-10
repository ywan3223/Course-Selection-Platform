const CourseModel = require("../model/CourseModel");
const ScheduleModel = require("../model/ScheduleModel");
const Response = require("../tool/Response");
const jwt = require("../tool/jwt");

class Course {
  constructor() {
    this.routes = [
      {
        url: "/course/select/:subject/:catalog",
        method: "get",
        handle: this.select,
      },
      { url: "/course/select/:subject", method: "get", handle: this.select },
      { url: "/course/search", method: "get", handle: this.search },
      { url: "/course/put", method: "post", handle: this.put },
      { url: "/course/delete", method: "post", handle: this.delete },
      { url: "/course/clearup", method: "post", handle: this.clearup },
      { url: "/subjects/all/get", method: "get", handle: this.getAllSubjects },
      {
        url: "/schedule/courses/get/:id",
        method: "get",
        handle: this.getCoursesByScheduleId,
      },
      {
        url: "/course-review/add",
        method: "post",
        handle: this.addCourseReview,
      },
      {
        url: "/course-info/get/:subject/:catalog",
        method: "get",
        handle: this.getCourseInfo,
      },
      {
        url: "/course-review/get/:subject/:catalog",
        method: "get",
        handle: this.getCourseReviews,
      },
      {
        url: "/course-review/visibility/toggle",
        method: "post",
        handle: this.toggleCourseReview
      }
    ];
  }

  /**
   * /course-review/visibility/toggle
   */
  async toggleCourseReview(req, res) {
    try {
      const { id, new_visibility } = req.body;
      const hidden_res = await CourseModel.toggleCourseReview(id, new_visibility);
      if (hidden_res) {
        res.send(Response(0, 'operate successfully!'));
      } else {
        res.send(Response(0, 'operate failly!'))
      }
    } catch(err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course-review/get/:subject/:catalog
   */
  async getCourseReviews(req, res) {
    try {
      const signature = jwt.resolveHeaderSignature(req);
      const user_info = jwt.getPayLoad(signature);
      const { subject, catalog } = req.params;
      const reviews = await CourseModel.getCourseReviews(subject, catalog, user_info.role);
      res.send(Response(0, "ok", reviews));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course-info/get/:subject/:catalog
   */
  async getCourseInfo(req, res) {
    try {
      const { subject, catalog } = req.params;
      const courses = await CourseModel.select(subject, catalog);
      res.send(Response(0, "ok", courses[0]));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course-review/add
   */
  async addCourseReview(req, res) {
    try {
      const { subject, catalog, reviewContent, userId } = req.body;
      const add_res = await CourseModel.addCourseReview(
        subject,
        catalog,
        reviewContent,
        userId
      );
      if (add_res) {
        res.send(Response(0, "review successfully!", {}));
      } else {
        res.send(Response(0, "review failly!", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /schedule/courses/get/:id
   */
  async getCoursesByScheduleId(req, res) {
    try {
      const { id } = req.params;
      const courses = await CourseModel.getAllCourses(id);
      res.send(Response(0, "ok", courses));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /subjects/all/get
   */
  async getAllSubjects(req, res) {
    try {
      const subjects_data = require("../Lab5-subject-data.json");
      const all_subjects = Object.keys(subjects_data);
      res.send(Response(0, "ok", all_subjects));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course/clearup
   * @query { schedule_id }
   */
  async clearup(req, res) {
    try {
      const { schedule_id } = req.body;
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", {}));
        return;
      }

      // get user info
      const user_info = jwt.getPayLoad(signature);

      // check schedule is whether belong this user or not
      const belong = await ScheduleModel.belongSomeOne(
        schedule_id,
        user_info.id
      );
      if (!belong) {
        res.send(Response(1, "the schedule is not belong this user", {}));
        return;
      }

      // clear up all courses
      const clear_res = await CourseModel.clearup(schedule_id);
      if (clear_res) {
        res.send(Response(0, "clear up schedule successfully", {}));
      } else {
        res.send(Response(0, "clear up schedule failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course/delete
   * @query { course_id }
   */
  async delete(req, res) {
    try {
      const { course_id } = req.body;
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", {}));
        return;
      }

      // get user info
      const user_info = jwt.getPayLoad(signature);

      //check the course whether is belong this user or not
      const belong = await CourseModel.belongSomeOne(course_id, user_info.id);
      if (!belong) {
        res.send(Response(1, "access dined", {}));
        return;
      }

      // delete
      const delete_res = await CourseModel.delete(course_id);
      if (delete_res) {
        res.send(Response(0, "delete successfully", {}));
      } else {
        res.send(Response(0, "delete failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course/put
   * @query { subject }
   * @query { catalog }
   * @query { schedule_id }
   */
  async put(req, res) {
    try {
      let { subject, catalog, schedule_id } = req.body;
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", {}));
        return;
      }
      const user_info = jwt.getPayLoad(signature);
      // check the schedule whether is belong this user or not
      const belong = await ScheduleModel.belongSomeOne(
        schedule_id,
        user_info.id
      );
      if (!belong) {
        res.send(Response(1, "the schedule is not belong this user", {}));
        return;
      }

      // add to schedule
      const put_res = await CourseModel.put(schedule_id, subject, catalog);
      if (put_res) {
        res.send(Response(0, "put course to the schedule successfully", {}));
      } else {
        res.send(Response(0, "put course to the schedule failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course/search
   * @query { className }
   * @query { catalog }
   */
  async search(req, res) {
    try {
      let { catalog, className } = req.query;
      catalog = catalog ? catalog.toUpperCase() : catalog;
      className = className ? className.toUpperCase() : className;
      const courses = await CourseModel.search(catalog, className);
      res.send(Response(0, "ok", courses));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /course/select/:subject/:catalog
   * /course/selcet/:subject
   */
  async select(req, res) {
    try {
      let { subject, catalog } = req.params;
      const courses = await CourseModel.select(subject, catalog);
      res.send(Response(0, "ok", courses));
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }
}

module.exports = new Course();
