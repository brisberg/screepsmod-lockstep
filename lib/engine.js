export default function(cconfig) {
  // Chain our custom stage after the existing stage.
  const config = cconfig;

  const oldCustomStage = config.engine.mainLoopCustomStage;

  const customStage = oldCustomStage.then(() => {
    console.log('lockstep custom stage!');
  });
  config.engine.mainLoopCustomStage = customStage;
}
