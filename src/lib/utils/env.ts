export const getSiteName = () => {
  return process.env.NODE_ENV === 'development' ? '[dev] cashsense' : 'cashsense'
}