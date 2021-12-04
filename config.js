//
// This file configures the domain url that is used to connect to the Convergence service.
//
// By default, it is configured to use the default options in the Convergence Development Edition
// (https://hub.docker.com/r/convergencelabs/convergence-omnibus)
// 
// These are the relevant parts of the URL: http://<host>:<host-port>/api/realtime/<namespace>/<domainId>
// const DOMAIN_URL = "http://localhost:8000/api/realtime/convergence/default";
// const DOMAIN_URL = "http://ec2-3-80-34-99.compute-1.amazonaws.com/api/realtime/convergence/default";
const DOMAIN_URL = 'https://www.uncintrostats.com/api/realtime/convergence/default'
// CORS issues: allow cross origin resources to be displayed on the same page
//  Allowed origin
// CHeck allocated ports on the intance.