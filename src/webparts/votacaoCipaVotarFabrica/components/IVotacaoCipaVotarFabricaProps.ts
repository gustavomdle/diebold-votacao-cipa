import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IVotacaoCipaVotarFabricaProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  listId: string;
}
