var EnvelopeGenerator = function(context) {
  this.attackTime = 0.01;
  this.releaseTime = 2;
  this.param = null;
  this.context = context;

  // var that = this;
    // $(document).bind('gateOn', function (_) {
    //   that.trigger();
    // });
    // $(document).bind('setAttack', function (_, value) {
    //   that.attackTime = value;
    // });
    // $(document).bind('setRelease', function (_, value) {
    //   that.releaseTime = value;
    // });
}

EnvelopeGenerator.prototype.trigger = function() {
  now = this.context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.setValueAtTime(0, now);
  this.param.linearRampToValueAtTime(1, now + this.attackTime);
  this.param.linearRampToValueAtTime(0, now + this.attackTime + this.releaseTime);
}

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param;
}


