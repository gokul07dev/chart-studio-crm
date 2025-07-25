import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, Building2 } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Deal {
  id: string;
  name: string;
  stage: string;
  value: string;
  owner: {
    name: string;
    avatar?: string;
  };
  account: string;
  activities: number;
}

const dealsData: Deal[] = [
  {
    id: '1',
    name: 'Google deal',
    stage: 'Test',
    value: '$70,000',
    owner: {
      name: 'Steven Scott',
      avatar: '/placeholder.svg'
    },
    account: 'Google',
    activities: 3
  }
];

export const DealsTable: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="space-y-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-0 h-auto">
            <div className="flex items-center gap-2 text-lg font-semibold text-dashboard-secondary">
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-0' : '-rotate-90'}`} />
              Active Deals
            </div>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Deal</TableHead>
                <TableHead className="text-muted-foreground">Activities timeline</TableHead>
                <TableHead className="text-muted-foreground">Stage</TableHead>
                <TableHead className="text-muted-foreground">Owner</TableHead>
                <TableHead className="text-muted-foreground">Deal Value</TableHead>
                <TableHead className="text-muted-foreground">Contacts</TableHead>
                <TableHead className="text-muted-foreground">Accounts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealsData.map((deal) => (
                <TableRow key={deal.id} className="border-border hover:bg-accent/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{deal.name}</span>
                      <span className="text-muted-foreground text-sm">{deal.activities}/{deal.activities}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-8 bg-dashboard-warning rounded-full" />
                      <div className="flex-1 h-2 bg-muted rounded-full">
                        <div className="w-1/3 h-full bg-dashboard-warning rounded-full" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="secondary" 
                      className="bg-dashboard-warning/20 text-dashboard-warning border-dashboard-warning/30"
                    >
                      {deal.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={deal.owner.avatar} />
                        <AvatarFallback className="text-xs">
                          {deal.owner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{deal.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{deal.value}</span>
                    <div className="text-xs text-muted-foreground">Sum</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-dashboard-secondary">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-dashboard-secondary/20">
                          {deal.owner.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{deal.owner.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-dashboard-accent">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">{deal.account}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="pt-4">
            <Button variant="ghost" className="text-dashboard-secondary hover:text-dashboard-secondary/80">
              + Add deal
            </Button>
          </div>

          {/* Summary Row */}
          <div className="bg-muted/30 rounded-lg p-4">
            <Table>
              <TableBody>
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="font-bold text-lg">$70,000</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};