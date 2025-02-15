import push from "@src/git/push.ts";

let currentTimeout = -1;

function queuePush(retry?: boolean) {
  clearTimeout(currentTimeout);

  currentTimeout = setTimeout(() => {
    push({ retry });
  }, 5000);
}

export default queuePush;
