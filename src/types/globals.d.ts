export type RawDataProps = {
  [key: string]: any;
};

export type DataProps<T = {}> = {
  alias: string;
  targetUrl: string;
} & T;

export type Function<A = {}, R = void> = (data: DataProps<A>) => R;
