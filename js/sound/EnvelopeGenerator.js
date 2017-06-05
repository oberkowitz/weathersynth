var EnvelopeGenerator = function(context, envOptions) {
  this.attack = envOptions["attack"] || 0.1;
  this.decay = envOptions["decay"] || 0.1;
  this.sustain = envOptions["sustain"] || 1.0;
  this.releaseTime = envOptions["release"] || 0.2;
  this.param = null;
  this.context = context;
}

EnvelopeGenerator.prototype.trigger = function() {
  var now = this.context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.setValueAtTime(0, now);
  this.param.linearRampToValueAtTime(1, now + this.attack);
  this.param.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
}

EnvelopeGenerator.prototype.release = function() {
  var now = this.context.currentTime;
  this.param.cancelScheduledValues(now);
  this.param.setValueAtTime(this.param.value, now);
  this.param.linearRampToValueAtTime(0.0, now + this.releaseTime); 
}

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param;
}

EnvelopeGenerator.prototype.setAttack = function(attack) {
  this.attack = attack;
};

EnvelopeGenerator.prototype.setDecay = function(decay) {
  this.decay = decay;
};

EnvelopeGenerator.prototype.setRelease = function(release) {
  this.release = release;
};

EnvelopeGenerator.prototype.setSustain = function(sustain) {
  this.sustain = sustain;
};





