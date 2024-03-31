import { ServiceBusClient } from "@azure/service-bus";
import { remember } from "@epic-web/remember";

export default remember(
	"bus",
	() =>
		new ServiceBusClient(
			process.env.NEXT_PUBLIC_SERVICE_BUS_CONNECTION_STRING!,
		),
);
