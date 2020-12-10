const jwt = require("../tool/jwt");
const Response = require("../tool/Response");
const ScheduleModel = require("../model/ScheduleModel");
const CourseModel = require("../model/CourseModel");
const Role = {
  visitor: "visitor",
  user: "user",
  admin: "admin",
};

class Schedule {
  constructor() {
    this.routes = [
      { url: "/schedule/create", method: "post", handle: this.create },
      { url: "/schedule/delete", method: "post", handle: this.delete },
      {
        url: "/private-schedules/get",
        method: "get",
        handle: this.getAllPrivateSchedules,
      },
      {
        url: "/public-schedules/get",
        method: "get",
        handle: this.getAllPublicSchedules,
      },
      {
        url: "/schedule-info/get/:id",
        method: "get",
        handle: this.getScheduleInfo,
      },
      { url: "/schedule/edit", method: "post", handle: this.editSchedule },
    ];
  }

  /**
   * /schedule/edit
   */
  async editSchedule(req, res) {
    try {
      const { id, name, type, description } = req.body;
      const edit_res = await ScheduleModel.edit(id, name, type, description);
      if (edit_res) {
        res.send(Response(0, "edit successfully!", {}));
      } else {
        res.send(Response(0, "edit failly!", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, []));
    }
  }

  /**
   * /schedule-info/get/:id
   */
  async getScheduleInfo(req, res) {
    try {
      const { id } = req.params;
      const info = await ScheduleModel.getScheduleInfo(id);
      res.send(Response(0, "ok", info));
    } catch (err) {
      res.send(Response(1, err.stack, []));
    }
  }

  /**
   * /public-schedules/get
   */
  async getAllPublicSchedules(req, res) {
    try {
      const all_public_schedules = await ScheduleModel.getAllPublicSchedules();
      res.send(Response(0, "ok", all_public_schedules));
    } catch (err) {
      res.send(Response(1, err.stack, []));
    }
  }

  /**
   * /all-schedules/get
   */
  async getAllPrivateSchedules(req, res) {
    try {
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", []));
        return;
      }

      // get user info
      const user_info = jwt.getPayLoad(signature);

      //get all user's schedules
      const all_schedules = await ScheduleModel.getAllSchedules(user_info.id);
      res.send(Response(0, "ok", all_schedules));
    } catch (err) {
      res.send(Response(1, err.stack, []));
    }
  }

  /**
   * /schedule/delete
   * @query { schedule_id } the id of schedule
   */
  async delete(req, res) {
    try {
      let { schedule_id } = req.body;
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", {}));
        return;
      }

      // check has right or not
      const user_info = jwt.getPayLoad(signature);
      if (user_info.role === Role.visitor) {
        res.send(Response(1, "you have not right to delete schedule.", {}));
        return;
      }

      // check schedule is whether belong this user or not
      const belong = await ScheduleModel.belongSomeOne(
        schedule_id,
        user_info.id
      );
      if (!belong) {
        res.send(Response(1, "the schedule is not belong this user", {}));
        return;
      }

      // delete schedule
      const delete_res = await ScheduleModel.delete(schedule_id);
      if (delete_res) {
        res.send(Response(0, "delete schedule successfully!", {}));
      } else {
        res.send(Response(1, "delete schedule failly", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }

  /**
   * /schedule/create
   * @query { name } schedule name
   * @query { type } public or private
   * @query { description } schedule's description
   */
  async create(req, res) {
    try {
      // create new schedule
      let { name, type = "private", description = "" } = req.body;
      // check signature whether is right or not
      const signature = jwt.resolveHeaderSignature(req);
      const secret = require("../secrets.json").secret;
      if (!jwt.verify(signature, secret)) {
        res.send(Response(1, "access dined", {}));
        return;
      }
      // get user info(payload) from signature
      const user_info = jwt.getPayLoad(signature);

      // has right to create private schedule
      if (user_info.role === Role.visitor) {
        res.send(
          Response(1, `you have not right to create private schedule`, {})
        );
        return;
      }

      // check wether up to maximum or not
      const up_to_maximun = await ScheduleModel.uptoCreateCountMaximum(
        user_info.id,
        user_info.role
      );
      if (up_to_maximun) {
        res.send(
          Response(1, `The creation quantity has reached the upper limit`, {})
        );
        return;
      }

      if (type === "public") {
        // check public schedule whether up to maximun or not
        let public_schedule_count = await ScheduleModel.getPublicScheduleCount();
        if (public_schedule_count >= 10) {
          res.send(Response(0, "sorry, the public count is up to maximum", {}));
          return;
        }
      }

      const create_res = await ScheduleModel.create(
        name,
        user_info.id,
        type,
        description
      );
      if (create_res) {
        res.send(Response(0, "create successfully!", {}));
      } else {
        res.send(Response(1, "create failly!", {}));
      }
    } catch (err) {
      res.send(Response(1, err.stack, {}));
    }
  }
}

module.exports = new Schedule();
