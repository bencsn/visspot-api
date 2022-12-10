import supertest from "supertest";
import server from "./app";

export function getServerForTesting(): supertest.SuperTest<supertest.Test> {
    return supertest(server);
}

export function testCleanup(): void {
    server.close();
}

export function testSetup(): void {
    // Do nothing
}