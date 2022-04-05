import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IVotacaoCipaVotarProps {
  description: string;
  siteurl: string;
  context: WebPartContext;
  listId: string;
}
