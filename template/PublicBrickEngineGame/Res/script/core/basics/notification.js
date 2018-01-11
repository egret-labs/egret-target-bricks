/**
 * Notification
 */
// class Notification {
//     name:string;   //name of the notification
//     notifiInfo:object;     //informations associated with the notification
//     userInfo:object;       //informations associate with the reveiver
//     constructor(parameters) {
var NotificationObserverMap = (function () {
    function NotificationObserverMap() {
    }
    return NotificationObserverMap;
}());
/**
 * NotificationObserverMap
 */
var NotificationObserverMap = (function () {
    function NotificationObserverMap(notificationName) {
        this.notificationName = notificationName;
        this.observers = [];
    }
    NotificationObserverMap.prototype.addObserver = function (observer) {
        this.observers.forEach(function (obs) {
        });
    };
    return NotificationObserverMap;
}());
/**
 * NotificationCenter
 */
var NotificationCenter = (function () {
    function NotificationCenter() {
        this.observersMap = [];
    }
    NotificationCenter.prototype.findNotificationObserverMapByName = function (name) {
        var isExist = false;
        var targetNOM = undefined;
        this.observersMap.forEach(function (element) {
            if (element.notificationName == name) {
                isExist = true;
                targetNOM = element;
            }
        });
        if (isExist == false) {
            var observersMapElem = { notificationName: name, observers: [] };
            this.observersMap.push(observersMapElem);
            return observersMapElem;
        }
        else {
            return targetNOM;
        }
    };
    NotificationCenter.prototype.addObserver = function (observer, callback, name, userdata) {
        var targetNOM = this.findNotificationObserverMapByName(name);
    };
    NotificationCenter.prototype.removeObserver = function (observer) {
    };
    NotificationCenter.prototype.postNotification = function (name, notifiInfo, userInfo) {
    };
    return NotificationCenter;
}());
// BK.Notification = Notification;
BK.NotificationCenter = new NotificationCenter();
BK.Script.log(0, 0, "Load Notification.js Succeed.");
