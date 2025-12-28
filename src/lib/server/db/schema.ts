import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, index, uuid, integer, unique } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned").default(false),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [
    index("verification_identifier_idx").on(table.identifier)
    ],
);

export const restaurant = pgTable(
    "restaurant",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        slug: text("slug").notNull().unique(),
        address: text("address").notNull(),
        automaticAllocation: boolean("automatic_allocation").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("restaurant_name_idx").on(table.name),
        index("restaurant_slug_idx").on(table.slug)
    ]
);

export const floor = pgTable(
    "floor",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        restaurantId: uuid("restaurant_id")
            .notNull()
            .references(() => restaurant.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("floor_name_idx").on(table.name),
        index("floor_restaurantId_idx").on(table.restaurantId),
        unique("floor_restaurantId_name_idx").on(table.restaurantId, table.name)
    ]
);

export const table = pgTable(
    "table",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        name: text("name").notNull(),
        capacity: integer("capacity").notNull(),
        pos_x: integer("pos_x").notNull(),
        pos_y: integer("pos_y").notNull(),
        shape: text("shape").notNull(),
        status: text("status").notNull(),
        visibility: text("visibility").notNull(),
        floorId: uuid("floor_id")
            .notNull()
            .references(() => floor.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("table_name_idx").on(table.name),
        index("table_floorId_idx").on(table.floorId),
        index("table_status_idx").on(table.status),
        index("table_visibility_idx").on(table.visibility)
    ]
);

export const reservation = pgTable(
    "reservation",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        tableId: uuid("table_id")
            .references(() => table.id, { onDelete: "cascade" }),
        name: text("name").notNull(),
        email: text("email"),
        phone: text("phone").notNull(),
        status: text("status", { enum: ["pending", "confirmed", "seated", "completed", "cancelled"] }).notNull(),
        partySize: integer("party_size").notNull(),
        dateTime: timestamp("reservation_date_time").notNull(),
        notes: text("notes"),
        createdBy: text("created_by"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("reservation_tableId_idx").on(table.tableId),
        index("reservation_status_idx").on(table.status),
        index("reservation_dateTime_idx").on(table.dateTime),
        index("reservation_date_status_idx").on(table.dateTime, table.status)
    ]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));
