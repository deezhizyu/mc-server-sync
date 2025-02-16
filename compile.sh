if [ ! -d "compiled" ]; then
  mkdir compiled
fi

if [ "$1" = "--windows" ]; then
  target="x86_64-pc-windows-msvc"
else
  target="x86_64-unknown-linux-gnu"
fi

deno compile --target $target --output compiled/mc-server-sync --env-file=.env -A main.ts
