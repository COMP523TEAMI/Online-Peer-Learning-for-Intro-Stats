FROM convergencelabs/convergence-omnibus
CMD /bin/env HTTP_PORT=$PORT ./boot.sh
# CMD /bin/bash