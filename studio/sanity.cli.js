import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '7lp9d7cd',
    dataset: 'production'
  },
  deployment: {
    appId: 'a249lhh4f2sfuqaob1n7ag2g',
    autoUpdates: true,
  }
})
