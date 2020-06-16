export default function(config) {
  if (config.engine) require('./engine').default(config)
}
