import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Cashier from "./_components/cashier";
import Rider from "./_components/rider";
const Staffs = () => {
  return ( 
      <div className="w-full">
          <Tabs defaultValue="cashier">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="cashier">Cashier</TabsTrigger>
              <TabsTrigger value="rider">Rider</TabsTrigger>
            </TabsList>
            <TabsContent value="cashier">
              <Cashier/>
            </TabsContent>
            <TabsContent value="rider">
              <Rider/>
            </TabsContent>
          </Tabs>
      </div> );
}
 
export default Staffs;