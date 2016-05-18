import "reflect-metadata";
import "bluebird";
import expect = require("expect.js");
import Rx = require("rx");
import sinon = require("sinon");
import PostCommandDispatcher from "../../scripts/commands/PostCommandDispatcher";
import HttpClient from "../../scripts/net/HttpClient";
import SinonSandbox = Sinon.SinonSandbox;
import IHttpClient from "../../scripts/net/IHttpClient";
import SinonStub = Sinon.SinonStub;
import {EndpointCommand} from "../fixtures/commands/MockCommands";
import CommandEnvelope from "../../scripts/commands/CommandEnvelope";
import MockDateRetriever from "../fixtures/MockDateRetriever";
import MockGuidGenerator from "../fixtures/MockGuidGenerator";
import IDateRetriever from "../../scripts/util/IDateRetriever";
import IGUIDGenerator from "../../scripts/util/IGUIDGenerator";

describe("PostCommandDispatcher, given a command", () => {

    let subject:PostCommandDispatcher,
        httpClient:IHttpClient,
        postStub:SinonStub,
        dateRetriever:IDateRetriever,
        guidGenerator:IGUIDGenerator;

    beforeEach(() => {
        httpClient = new HttpClient();
        dateRetriever = new MockDateRetriever();
        guidGenerator = new MockGuidGenerator();
        subject = new PostCommandDispatcher(dateRetriever, guidGenerator, httpClient, {endpoint: ""});
        postStub = sinon.stub(httpClient, "post", () => Rx.Observable.just({response: null}));
    });

    afterEach(() => {
        postStub.restore();
    });

    context("when the transport to be used is an HTTP Post", () => {
        it("should send it using an http client", () => {
            subject.dispatch(new EndpointCommand(), {});
            let envelope = CommandEnvelope.of(new EndpointCommand(), {});
            envelope.type = "EndpointCommand";
            envelope.createdTimestamp = "2016-05-16T09:52:18Z";
            envelope.id = "42";
            expect(postStub.calledWith("/foo", envelope)).to.be(true);
        });

        context("and there is a base url specified", () => {
            it("should prepend the base url in the request", () => {
                subject = new PostCommandDispatcher(dateRetriever, guidGenerator, httpClient, {endpoint: 'http://baseurl.com'});
                subject.dispatch(new EndpointCommand(), {});
                expect(postStub.args[0][0]).to.be('http://baseurl.com/foo');
            });
        });
    });
});