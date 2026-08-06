import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";
describe("Zarka Field manifest", () => { it("is installable and launches into the private Field route", () => { const value=manifest(); expect(value).toMatchObject({ name:"Zarka Field", short_name:"Zarka", start_url:"/field", display:"standalone", scope:"/" }); expect(value.icons).toHaveLength(2); }); });