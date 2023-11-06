FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=server --prod /prod/server
RUN pnpm deploy --filter=client --prod /prod/client

FROM base AS server
COPY --from=build /prod/server /prod/server
COPY --from=build /prod/client /prod/client
WORKDIR /prod/server
# EXPOSE 8000
CMD [ "pnpm", "start" ]
